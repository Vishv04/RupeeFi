const Button = ({ children, variant = 'primary', type = 'button', onClick, className = '', fullWidth = false }) => {
  const baseStyles = 'px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const variants = {
    primary: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white',
    outline: 'border border-cyan-600 text-cyan-500 hover:bg-cyan-600/10',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${widthStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button; 