export const fadeInUp = (element: Element, delay: number = 0) => {
  return element.animate(
    [{ transform: 'translateY(50px)', opacity: '0' }, { transform: 'translateY(0)', opacity: '1' }],
    { duration: 1000, delay: delay * 1000, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', fill: 'forwards' }
  );
};

export const staggerElements = (element: Element, delay: number = 0) => {
  return element.animate(
    [{ transform: 'translateY(20px)', opacity: '0' }, { transform: 'translateY(0)', opacity: '1' }],
    { duration: 800, delay: delay * 1000, easing: 'ease-out', fill: 'forwards' }
  );
};