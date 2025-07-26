import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import * as Tabs from '../Tabs.js';
import * as styles from './CodeGroup.css.js';
const STORAGE_KEY = 'codegroup-selected-tab';
export function CodeGroup({ children }) {
    if (!Array.isArray(children))
        return null;
    const tabs = children.map((child_) => {
        const child = child_.props['data-title'] ? child_ : child_.props.children;
        const { props } = child;
        const title = props['data-title'];
        const content = props.children;
        return { title, content };
    });
    const tabValues = tabs.map(tab => tab.title || '').filter(Boolean);
    const [selectedTab, setSelectedTab] = useState(tabs[0]?.title || '');
    // Load from localStorage on mount and set up listener
    useEffect(() => {
        const loadFromStorage = () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored && tabValues.includes(stored)) {
                    setSelectedTab(stored);
                }
            }
            catch (error) {
                // Handle localStorage access errors (e.g., in SSR or private browsing)
                console.warn('Could not access localStorage for code group tab:', error);
            }
        };
        // Load initial value
        loadFromStorage();
        // Listen for storage changes from other tabs/windows
        const handleStorageChange = (e) => {
            if (e.key === STORAGE_KEY && e.newValue && tabValues.includes(e.newValue)) {
                setSelectedTab(e.newValue);
            }
        };
        // Listen for custom storage events from same page
        const handleCustomStorageChange = (e) => {
            const newValue = e.detail.value;
            if (newValue && tabValues.includes(newValue)) {
                setSelectedTab(newValue);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('codegroup-storage-change', handleCustomStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('codegroup-storage-change', handleCustomStorageChange);
        };
    }, [tabValues]);
    const handleTabChange = (value) => {
        setSelectedTab(value);
        try {
            localStorage.setItem(STORAGE_KEY, value);
            // Dispatch custom event for same-page synchronization
            window.dispatchEvent(new CustomEvent('codegroup-storage-change', {
                detail: { value }
            }));
        }
        catch (error) {
            console.warn('Could not save code group tab to localStorage:', error);
        }
    };
    return (_jsxs(Tabs.Root, { className: styles.root, value: selectedTab, onValueChange: handleTabChange, children: [_jsx(Tabs.List, { "aria-label": "Code group", children: tabs.map(({ title }, i) => (_jsx(Tabs.Trigger, { value: title || i.toString(), children: title }, title || i.toString()))) }), tabs.map(({ title, content }, i) => {
                const isShiki = content.props?.children?.props?.className?.includes('shiki');
                return (_jsx(Tabs.Content, { "data-shiki": isShiki, value: title || i.toString(), children: content }, title || i.toString()));
            })] }));
}
//# sourceMappingURL=CodeGroup.js.map