const Users = require('../config/models/users.models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Error } = require('mongoose');

class AuthService {
    async signUp(name, email, password, confirm_password,  auth_type = 'local') {
        try {
            
            if (!email || !password || !confirm_password || !name ) {
                throw new Error('Thiếu thông tin bắt buộc.');
            }

           
            if (password !== confirm_password) {
                throw new Error('Mật khẩu xác nhận không khớp.');
            }

           
            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Email không hợp lệ.');
            }

            
            const existingUser = await Users.findOne({ email });
            if (existingUser) {
                throw new Error('Email đã được sử dụng.');
            }

           
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

           
            const newUser = await Users.create({
                name,
                email,
                password: hashedPassword,
                auth_type,
                is_active: true
            });

            return {
                success: true,
                user: {
                    name: newUser.name,
                    email: newUser.email,
                }
            };
        } catch (error) {
            throw new Error(`Đăng ký thất bại: ${error.message}`);
        }
    }

    async login(email, password) {
        try {
            // Check required fields
            if (!email || !password) {
                throw new Error('Thiếu thông tin bắt buộc.');
            }

            // Find user
            const user = await Users.findOne({ email });
            if (!user) {
                throw new Error('Tài khoản không tồn tại.');
            }

            // Check if user is active
            if (!user.is_active) {
                throw new Error('Tài khoản đã bị khóa.');
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Mật khẩu không đúng.');
            }

            // Create tokens
            const accessToken = jwt.sign(
                { 
                    id: user._id, 
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: '29m' }
            );

            const refreshToken = jwt.sign(
                { 
                    id: user._id, 
                    email: user.email
                },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '14d' }
            );

            // Update user
            user.refresh_token = refreshToken;
            user.last_login = new Date();
            await user.save();

            return {
                success: true,
                message: 'Đăng nhập thành công.',
                accessToken,
                refreshToken,
                user: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar
                }
            };
        } catch (error) {
            throw new Error(`Đăng nhập thất bại: ${error.message}`);
        }
    }

    async logout(userId) {
        try {
            if (!userId) {
                throw new Error("Thiếu thông tin người dùng.");
            }

            const user = await Users.findById(userId);
            if (!user) {
                throw new Error("Không tìm thấy người dùng.");
            }

            user.refresh_token = null;
            await user.save();

            return { 
                success: true, 
                message: "Đăng xuất thành công." 
            };
        } catch (error) {
            throw new Error(`Đăng xuất thất bại: ${error.message}`);
        }
    }

    async forgotPassword(email, newPassword, confirmPassword) {
        try {
            // Validate input
            if (!email || !newPassword || !confirmPassword) {
                throw new Error('Thiếu thông tin bắt buộc.');
            }

            // Find user
            const user = await Users.findOne({ email });
            if (!user) {
                throw new Error('Email không tồn tại.');
            }

            // Check if user is active
            if (!user.is_active) {
                throw new Error('Tài khoản đã bị khóa.');
            }

            // Validate password match
            if (newPassword !== confirmPassword) {
                throw new Error('Mật khẩu xác nhận không khớp.');
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password
            user.password = hashedPassword;
            await user.save();

            return {
                success: true,
                message: 'Đổi mật khẩu thành công.'
            };
        } catch (error) {
            throw new Error(`Đổi mật khẩu thất bại: ${error.message}`);
        }
    }
}

module.exports = new AuthService();