//in /src lives all the front-end React code

import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import { Provider } from "react-redux";
import { getSocket } from "./socket.js";

// socket.emit("hi", {
//     funky: "chicken"
// });

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
//import Welcome from './welcome'

// let myJsx = <strong>Hi</strong>;

//JSX elements are truly JS objects that React uses to represent and keep track of what is showing in the screen;

//
//
let elem;

if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = (getSocket(store),
    (
        <Provider store={store}>
            <App />
        </Provider>
    ));
}

ReactDOM.render(
    elem, // JSX
    document.querySelector("main")
);

//HelloWorld is a React component, all React components MUST start with capital letter

// function HelloWorld(props) {
//     const style ={
//         color: "DeepPink",
//         fontSize: "20px"
//     };
//     console.log(props);//it will log the prop you give when rendering (greetee="Kitty")
//     return ( //all the elements must be wrapped together (no siblings allowed), BUT you can also pass an array of elements// string and null
//         <div id="hi" className="greeting" style={style}>Hello,{props.greetee || "World"}!
//             <p> Hello, <Greetee name={props.greete}/> </p>!
//             <p> wussup </p>
//
//         </div> // you can add id to elements as usual, BUT for class we need className, after compilation it will be old class=""/ .class (css)
//     );
// }
//
// function Greetee({name}) {
//
//     return <strong>{name}</strong>;
// }
