const Card = ({ title, subtitle, right, children }) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      {(title || right) && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;


