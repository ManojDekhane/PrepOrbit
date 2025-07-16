
function CardItem({ title, imageSrc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-transform hover:scale-105 border border-gray-200"
    >
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-50 object-cover rounded-t-xl"
      />
      <div className="p-5 text-center">
        <h3 className="text-xl font-semibold text-blue-700 mb-1">{title}</h3>
        
      </div>
    </div>
  );
}

export default CardItem;
