export default function AvatarIcon({
  imageUrl,
}: {
  imageUrl: string | undefined;
}) {
  return (
    <div>
      {imageUrl ? (
        <img className="h-8 w-8 rounded-md" src={imageUrl} alt="" />
      ) : (
        <div className="bg-gray-300 rounded-md w-8 h-8"></div>
      )}
    </div>
  );
}
