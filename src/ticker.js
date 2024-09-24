import React from "react";
import Ticker from "react-ticker";

const MoveStuffAround = () => (
    <Ticker className="ticker">
        {({ index }) => (
            <div>
                <h5> *&nbsp; Today's control resports &nbsp;</h5>
            </div>
        )}
    </Ticker>
);

export default MoveStuffAround;
