import * as React from "react"
import { createContext, useContext, useState } from 'react';

const TabsContext = createContext({});

const TabsRoot = ({ defaultValue, children, className }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);
    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
};

const TabsListSimple = ({ children, className }) => (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}>
        {children}
    </div>
);

const TabsTriggerSimple = ({ value, children, className }) => {
    const { activeTab, setActiveTab } = useContext(TabsContext);
    const isActive = activeTab === value;
    return (
        <button
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all 
            ${isActive ? 'bg-white text-black shadow-sm' : 'hover:bg-gray-200'} ${className}`}
            onClick={() => setActiveTab(value)}
            type="button"
        >
            {children}
        </button>
    );
};

const TabsContentSimple = ({ value, children, className }) => {
    const { activeTab } = useContext(TabsContext);
    if (activeTab !== value) return null;
    return <div className={`mt-2 ${className}`}>{children}</div>;
};

export { TabsRoot as Tabs, TabsListSimple as TabsList, TabsTriggerSimple as TabsTrigger, TabsContentSimple as TabsContent };
