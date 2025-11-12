import React from "react";
import styles from "./LottieWithDot.module.css"
import { DotLottieReact  } from "@lottiefiles/dotlottie-react";

const LottieWithDot = ({src, width, height}) =>{
    return(
        <div className={styles.lottie_dot_wrapper}>
            <DotLottieReact 
            src={src}
            autoplay
            loop
            style={{height:height, width:width}}
            renderer="canvas" 
            />
        </div>
    )
}

export default LottieWithDot;