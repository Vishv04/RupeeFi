import React, { useEffect } from "react";
import { ArrowUpFromDot } from "lucide-react";
import Styled from "styled-components";

const TopBar = () => {
  const [isvisible, setIsVisible] = React.useState(false);

  // Add the button fucntionality to Scroll-Up 
  const onTopbtn = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  // >>>Define the scroll event handler function *****
  const handleScroll = () => {
    document.querySelector(".on-top-bar");
    if (window.scrollY > 120) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Render the component AS useEffect
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Container>
      {isvisible && (
        <div className="on-top-bar" onClick={onTopbtn}>
          <ArrowUpFromDot className="w-6 h-6  text-yellow-300" />
        </div>
      )}
    </Container>
  );
};

const Container = Styled.section`
   display: flex;
   justify-content: center;
    align-items: center;

 

.on-top-bar {
    position: fixed;
    bottom: 100px;
    right: 18px;
    background-color: #4f39f6;
    color: #fff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
 
    &:hover {
        background-color: #3b2ce6;
        transform: scale(1.1);
    }
 
}

`;

export default TopBar;
