import React from "react";

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.startCaroussel = this.startCaroussel.bind(this);
    }
    componentDidMount() {
        this.startCaroussel();
    }
    startCaroussel() {
        var kitties = document.getElementsByClassName("kitty"); // gets an array-like object with all dem kitties (index will not change, only onscreen/exiting class)
        var dots = document.getElementsByClassName("dots");
        var len = kitties.length;
        var lenDots = dots.length;
        var current = 0;
        var inTransition;

        kitties[current].classList.add("onscreen");
        dots[current].classList.add("lit");

        function getClickHandler(i) {
            return function(e) {
                if (e.target.classList.contains("lit")) {
                    //if the dot is already white, ignore
                    return;
                }
                if (inTransition) {
                    //if the transition is going on, ignore ¡¡¡¡¡¡¡¡VALUE OF inTransition DEFINED BY moveKitties()!!!!!!!!!!!!!!! Like a Toggle Switch
                    return;
                }
            };
        }

        //for (var i = 0; i < lenDots; i++) {
        // dots[i].addEventListener("click", getClickHandler(i));

        function moveKitties() {
            inTransition = true; //
            kitties[current].classList.remove("onscreen"); // removes on class from current
            kitties[current].classList.add("exiting"); // and adds exiting to it
            dots[current].classList.remove("lit"); // removes lit class AKA whiteness from the current dots

            inTransition = false;
            kitties[current].addEventListener("transitionend", function() {
                event.target.classList.remove("exiting");
            });

            current++; // change variable that is keeping track of the current to reflect the fact that the current one is now what used to be the next one. i.e., the next one becomes the current.
            if (current >= len) {
                current = 0; // si el valor actual trata de ser mayor que la longitud del array volverá a ser cero, lo que hace que sea un circuito cerrado
            }

            kitties[current].classList.add("onscreen");
            dots[current].classList.add("lit");
            setTimeout(moveKitties, 5000);
            //    * adds the onscreen/lit class to the NEW current
        }

        setTimeout(moveKitties, 5000);
    }

    render() {
        return (
            <div className="wholecaroussel">
                <div id="caroussel">
                    <div className="kitty">
                        <img src="assets\kit1.jpg" alt="cute kitty" />
                    </div>

                    <div className="kitty">
                        <img src="assets\kit2.jpg" alt="cute kitty" />
                    </div>

                    <div className="kitty">
                        <img src="assets\kit3.jpg" alt="cute kitty" />
                    </div>

                    <div className="kitty">
                        <img src="assets\kit4.jpg" alt="cute kitty" />
                    </div>
                </div>

                <div className="wrap">
                    <div className="dots" id="k1" />
                    <div className="dots" id="k2" />
                    <div className="dots" id="k3" />
                    <div className="dots" id="k4" />
                </div>
            </div>
        );
    }
}
