import Update from "../../providers/update";

export const setRoute = routeName => Update(({router})=> {
    const {route : currRoute} = router;
    return currRoute !==  routeName ? {
        router: {
            pre: currRoute,
            route: routeName
        }
    } : null});
