import { useNavigate } from "react-router-dom";

const DEMO_DATE = "Nov 02, 2026, 02:00 PM";

const Title = ({ record }: { record: any }) => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col gap-0.5 min-w-0 pr-3">
			<span
				onClick={() => navigate(`/update/${record?.id}`)}
				className="text-sm font-[510] leading-5 truncate cursor-pointer hover:underline"
				style={{ color: "var(--opt-text-default)" }}
				title={record?.title}
			>
				{record?.title}
			</span>
			<span
				className="text-xs leading-4 truncate"
				style={{ color: "var(--opt-text-tertiary)" }}
			>
				{`Last update: ${DEMO_DATE}`}
			</span>
		</div>
	);
};

export default Title;
