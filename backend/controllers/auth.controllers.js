'use strict'
const authServices = require('../services/auth.services')

class AuthController {
    async signUp(req, res) {
        try { 
            console.log(req.body);
            
            const { name, email, password, confirm_password,  auth_type } = req.body;

           
            if (!name || !email || !password || !confirm_password ) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc.'
                });
            }

            const result = await authServices.signUp(
                name, 
                email, 
                password, 
                confirm_password, 
                auth_type
            );

            res.status(200).json({
                success: true,
                message: 'Đăng ký thành công.',
                data: result.user
            });
        } catch (error) {
            console.error('SignUp error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Đăng ký thất bại.'
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validate required fields
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc.'
                });
            }

            const result = await authServices.login(email, password);

            res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công.',
                data: {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    user: result.user
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Đăng nhập thất bại.'
            });
        }
    }
    
    async logout(req, res) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Thiếu thông tin người dùng." 
                });
            }

            await authServices.logout(userId);

            res.status(200).json({ 
                success: true, 
                message: "Đăng xuất thành công." 
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message || "Đăng xuất thất bại." 
            });
        }
    }
    
    async forgotPassword(req, res) {
        try {
            const { email, newPassword, confirmPassword } = req.body;

            // Validate required fields
            if (!email || !newPassword || !confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc.'
                });
            }

            await authServices.forgotPassword(email, newPassword, confirmPassword);

            res.status(200).json({
                success: true,
                message: 'Đổi mật khẩu thành công.'
            });
        } catch (error) {
            console.error('ForgotPassword error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Đổi mật khẩu thất bại.'
            });
        }
    }
}

module.exports = new AuthController();