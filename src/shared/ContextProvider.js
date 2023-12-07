import React, { createContext, useState } from "react";

/*
This is some fairly eldritch code so I think I should probably explain a bit.

I'm used to Vue, which is a lot richer than React. Part of Vue is Vuex, which is a state management library
that tightly integrates with Vue as a whole. React has nothing like that - there are large bolt on libraries
that integrate with React for state like Redux and mobx but they are big, and opinionated, and overly complex -
at least from the perspective of a Vue developer. So, I figured I could use/abuse React's conext API to
make a lightweight VueX like state management system.

The way this works is we create a context provider that manages an instace of this FirelinkState class.
FirelinkState has a method called updateContext that takes a callback function that is called whenever the state changes.
After we create our state in the ContextProvider we pass the setAppState function to the FirelinkState class as
the updateContext function. This way the FirelinkState class can call setAppState whenever it needs to update the state.

That's only half the battle though. In order for the state object to be reactive React needs to see the new state
and the old state as not passing an equality test. Which means we can't just update the FirelinkState instance.
If you look in the update method we create a new instance of FirelinkState, set all of the properties of the new
state to the old state, and then override the new state properties with the passed in opts. THEN we call the callback
which we know will update the ContextProvider's state. Clever girl.

What this means is that in components we can do stuff like this:
    return <div>
        <Title headingLevel="h1" size={TitleSizes['3xl']}>
            <TextInput id="requester-input" value={AppState.requester} onChange={(e) => {
                AppState.update({requester: e})
            }} />
        </Title>
    </div>

We can render in a reactive way by observing properties of the AppState, and we can update the
state just with a call to AppState.update with some supplied opts. This is a lot like how VueX works.
It also means that since FirelinkState is a class we can plop methods on it, like fetch methods. Meaning
we can centralize a lot of our calls to the web server in one place, and reuse them. Tres cool.

So, this likely isn't idiomatic from a React perspective. Which is a bummer, I know. But to me this is just
more elegant than importing some big, bloated, opinionated library. 
*/
class FirelinkState {
    requester = "";
    namespaces = [];
    apps = [];

    updateContext = () => {}

    isNamespacesEmpty() {
        return this.namespaces.length === 0;
    }

    isAppsEmpty() {
        return this.apps.length === 0;
    }

    myReservations() {
        return this.namespaces.filter(namespace => namespace.requester === this.requester);
    }

    requesterIsSet() {
        return this.requester !== "";
    }

    update(opts) {
        let newState = new FirelinkState();            
        const myKeys = Object.keys(this);
        myKeys.forEach((key, index) => {
            newState[key] = this[key]
        });
        const incomingKeys = Object.keys(opts);
        incomingKeys.forEach((key, index) => {
            newState[key] = opts[key]
        });
        this.updateContext(newState);
        return newState
    }

    getNamespaces() {
        return fetch('/api/firelink/namespace/list')
        .then(response => response.json())
        .then(namespaces => {
            this.update({namespaces: namespaces})
        });
    }

    getApps() {
        return fetch('/api/firelink/apps/list')
        .then(response => response.json())
        .then(apps => {
            this.update({apps: apps})
        });
    }


}


export const AppContext = createContext();

const ContextProvider = ({ children }) => {

    const [AppState, setAppState] = useState(new FirelinkState());
    AppState.updateContext = setAppState;

    return <AppContext.Provider value={[AppState, setAppState]}>
        {children}
    </AppContext.Provider>;
};

export default ContextProvider;