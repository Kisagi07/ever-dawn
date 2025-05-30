const getLocale = () => {
    // Get locale for today total focus
    const locale = navigator.language;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; 
    
    return {locale, timeZone}
}

export default getLocale