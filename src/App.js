import React, { Suspense } from "react";
import Router from "./router/Router";
import GlobalSpinner from './views/GlobalSpinner';

const App = () => {
    return (
        <>
            <GlobalSpinner />
            <Suspense fallback={null}>
                <Router />
            </Suspense>
        </>
    );
};

export default App;


