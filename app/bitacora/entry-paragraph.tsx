export default function BitacoraParagraph({
	text,
	className,
}: {
	text: string;
	className?: string;
}) {
	return (
		<p className={className}>
			{text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
				if (part.startsWith("**") && part.endsWith("**")) {
					return <strong key={index}>{part.slice(2, -2)}</strong>;
				}
				if (part.startsWith("*") && part.endsWith("*")) {
					return <em key={index}>{part.slice(1, -1)}</em>;
				}
				return part;
			})}
		</p>
	);
}
