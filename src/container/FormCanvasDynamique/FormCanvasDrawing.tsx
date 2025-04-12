


// recupération des atomes dynamiquement ${id}-boundingBox
// recupération des atomes dynamiquement ${id}-inputValue
// recupération des atomes dynamiquement ${id}-boundingBox





const [currentBoundingBox] = useAtom(`${id}-boundingBox`);
const [inputValue, setInputValue] = useAtom(`${id}-inputValue`);
const [selectedLabelField, setSelectedLabelField] = useAtom(`${id}-boundingBox`);


// Synchroniser avec formBoxsAtom
useEffect(() => {
    setFormBoxs((prev) =>
        prev.map((element) =>
            element.id === id
                ? { ...element, inputValue, selectedLabelField }
                : element
        )
    );
}, [id, inputValue, selectedLabelField, setFormBoxs]);