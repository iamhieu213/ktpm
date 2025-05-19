import { assets } from "../../../../assets/assets";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Members.css";

const Members = () => {
  const member = [
    {
      fullName: "Nguyễn Văn Hiếu",
      sid: "20225717",
      img: assets.Hieu,
      role : "Frontend and Backend Team"
    },
    {
      fullName: "Con chó súc vật",
      sid: "20225897",
      img: assets.Nhat,
      role : "Frontend and Backend Team"
    },
    {
      fullName : "Nguyễn Đức Quang",
      sid : "20225913",
      img : assets.Quang,
      role : "Frontend Team"
    },
    {
      fullName : "Đinh Tuấn Kiệt",
      sid : "20225872",
      img : assets.Kiet,
      role : "Frontend Team"
    },
    {
      fullName : "Hà Ngọc Huy",
      sid : "20225855",
      img : assets.Huy,
      role : "Frontend Team"
    }
  ];

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <div className="container-tdn">
        <div className="slider-container">
          {/* Đang báo lỗi ở dòng 86 này */}
          <Slider {...settings}>
            {member.map((item, index) => {
              return (
                <>
                  <div className="member" key={index}>
                    <div className="member__img">
                      <img src={item.img} alt="ahihi" />
                    </div>
                    <div className="member__info">
                      <div className="name">{item.fullName}</div>
                      <div className="sid">{item.sid}</div>
                    </div>
                     <div className="member__role">{item.role}</div>
                  </div>
                </>
              );
            })}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default Members;
