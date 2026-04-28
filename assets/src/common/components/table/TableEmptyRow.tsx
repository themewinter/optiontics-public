import type { ReactNode } from "@wordpress/element";

interface TableEmptyRowProps {
    colSpan: number;
    emptyText: ReactNode;
    emptyRender?: () => ReactNode;
}

export function TableEmptyRow({ colSpan, emptyText, emptyRender }: TableEmptyRowProps) {
    return (
        <tr>
            <td colSpan={colSpan} className="text-center py-12 text-muted-foreground">
                {emptyRender ? emptyRender() : emptyText}
            </td>
        </tr>
    );
}
