updateInteractionBar();

adjustZoom();

closeButtons.forEach(x => {
    x.addEventListener('click', () => {
        dialogs.forEach(y => y.style.display = "none")
    })
})