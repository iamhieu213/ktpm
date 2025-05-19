import { assets } from "../../../../assets/assets"
import './TechMarquee.css'
const TechMarquee = () => {
    return (
        <>
            <div className="home__tech">
                <div className="container-tdn2">
                    <div className="inner-tech">
                        <div className="desc">Technology used</div>
                        <div className="wrap-tdn fade-out">
                            <div className="tech__main">
                                <div className="tech__item">
                                    <div className="item__icon">
                                        <img src={assets.react}
                                            alt="react" />
                                    </div>
                                    <div className="item__content">React</div>
                                </div>
                                <div className="tech__item">
                                    <div className="item__icon">
                                        <img src={assets.nodejs}
                                            alt="spring" />
                                    </div>
                                    <div className="content">Nodejs</div>
                                </div>
                                <div className="tech__item">
                                    <div className="item__icon">
                                        <img src={assets.mongoDB}
                                            alt="mysql" />
                                    </div>
                                    <div className="content">MongoDB</div>
                                </div>
                                <div className="tech__item">
                                    <div className="item__icon">
                                        <img src={assets.postman}
                                            alt="firebase" />
                                    </div>
                                    <div className="content">Postman</div>
                                </div>
                                <div className="tech__item">
                                    <div className="item__icon">
                                        <img src={assets.rest_api}
                                            alt="rest" />
                                    </div>
                                    <div className="content">Rest:API</div>
                                </div>
                                <div className="tech__item">
                                    <div className="item__icon">
                                        <img src={assets.javaSript}
                                            alt="java" />
                                    </div>
                                    <div className="content">Javascript</div>
                                </div>
                                <div className="tech__item">
                                    <div className="item__icon">
                                        <img src={assets.typescript}
                                            alt="typescript" />
                                    </div>
                                    <div className="content">TypeScript</div>
                                </div>
                            </div>
                            <div className="tech__main">
                                <div className="tech__item">
                                    <div className="item__icon">
                                        <img src={assets.react}
                                            alt="react" />
                                    </div>
                                    <div className="item__content">React</div>
                                </div>
                                <div className="tech__item">
                                    <div className="item__icon">
                                        <img src={assets.nodejs}
                                            alt="spring" />
                                    </div>
                                    <div className="content">Nodejs</div>
                                </div>
                                <div className="tech__item">
                                    <div className="item__icon">
                                        <img src={assets.mongoDB}
                                            alt="mysql" />
                                    </div>
                                    <div className="content">MongoDB</div>
                                </div>
                                <div className="tech__item">
                                    <div className="item__icon">
                                        <img src={assets.tailwind}
                                            alt="firebase" />
                                    </div>
                                    <div className="content">TailwindCSS</div>
                                </div>
                                <div className="tech__item">
                                    <div className="item__icon">
                                        <img src={assets.rest_api}
                                            alt="rest" />
                                    </div>
                                    <div className="content">Rest:API</div>
                                </div>
                                <div className="tech__item">
                                    <div className="item__icon">
                                        <img src={assets.javaSript}
                                            alt="javascript" />
                                    </div>
                                    <div className="content">Javascript</div>
                                </div>
                                <div className="tech__item">
                                    <div className="item__icon">
                                        <img src={assets.typescript}
                                            alt="typescript" />
                                    </div>
                                    <div className="content">TypeScript</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TechMarquee