export function restoreHomeSectionPosition() {
  if (!window.matchMedia('(min-width: 768px)').matches) {
    return;
  }

  const match = window.location.hash.match(/^#section(\d+)$/);
  const wrapper = document.getElementById('fullpageWrapper');
  const section = match ? document.getElementById(`section${match[1]}`) : null;

  if (!(wrapper instanceof HTMLElement) || !(section instanceof HTMLElement) || !wrapper.contains(section)) {
    return;
  }

  const scrollContainer = wrapper.closest<HTMLElement>('.app-scroll');
  const wrapperBehavior = wrapper.style.scrollBehavior;
  const wrapperSnap = wrapper.style.scrollSnapType;
  const containerBehavior = scrollContainer?.style.scrollBehavior ?? '';

  try {
    wrapper.style.scrollBehavior = 'auto';
    wrapper.style.scrollSnapType = 'none';
    if (scrollContainer) {
      scrollContainer.style.scrollBehavior = 'auto';
      scrollContainer.scrollTop = 0;
    }

    wrapper.scrollTop = section.offsetTop - wrapper.offsetTop;
    document.querySelectorAll<HTMLButtonElement>('#pageDots button').forEach((dot) => {
      dot.classList.toggle('active-dot', dot.dataset.target === section.dataset.index);
    });
  } finally {
    wrapper.style.scrollBehavior = wrapperBehavior;
    wrapper.style.scrollSnapType = wrapperSnap;
    if (scrollContainer) {
      scrollContainer.style.scrollBehavior = containerBehavior;
    }
  }
}
