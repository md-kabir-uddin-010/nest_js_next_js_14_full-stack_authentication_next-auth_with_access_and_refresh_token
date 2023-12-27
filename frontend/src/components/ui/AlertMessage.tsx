export type AleartMessageProps = {
  type: "success" | "error";
  text: string;
};

export default function AlertMessage({ type, text }: AleartMessageProps) {
  return (
    <div
      className={` my-1 w-full py-1 px-2 rounded-md border-2 ${
        type === "error"
          ? "border-red-300 bg-red-200"
          : "border-green-300 bg-green-200"
      }`}
    >
      <p>{text}</p>
    </div>
  );
}
