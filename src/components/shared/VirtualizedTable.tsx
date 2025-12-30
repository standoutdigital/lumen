import React from 'react';
import { AutoSizer, Table, Column, TableProps, SortDirection, SortDirectionType } from 'react-virtualized';
import 'react-virtualized/styles.css'; // Import styles as requested

// Custom styles for the table to match the glassmorphism design
const tableStyles = `
  .ReactVirtualized__Table__headerRow {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: #9ca3af;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding-right: 0 !important; /* Fix padding issue */
  }

  .ReactVirtualized__Table__row {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: background-color 0.1s ease;
  }

  .ReactVirtualized__Table__row:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .ReactVirtualized__Table__headerColumn {
    padding: 0.75rem 1.5rem;
    outline: none;
  }

  .ReactVirtualized__Table__rowColumn {
    padding: 0.75rem 1.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    outline: none;
  }
`;

export interface IColumn {
    label: string;
    dataKey: string;
    width?: number; // Optional custom width
    flexGrow?: number; // Optional flex grow
    sortable?: boolean;
    cellRenderer?: (cellData: any, rowData: any) => React.ReactNode;
}

interface VirtualizedTableProps {
    data: any[];
    columns: IColumn[];
    onRowClick?: (rowData: any) => void;
    sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
    onSort?: (key: string) => void;
    rowHeight?: number;
    headerHeight?: number;
}

export const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
    data,
    columns,
    onRowClick,
    sortConfig,
    onSort,
    rowHeight = 50,
    headerHeight = 40
}) => {

    const headerRenderer = ({ label, dataKey, sortBy, sortDirection }: any) => {
        return (
            <div className="flex items-center gap-1 cursor-pointer select-none">
                {label}
                {sortBy === dataKey && (
                    <span className="text-xs">
                        {sortDirection === SortDirection.ASC ? '▲' : '▼'}
                    </span>
                )}
            </div>
        );
    };

    const _sort = ({ sortBy, sortDirection }: { sortBy: string, sortDirection: SortDirectionType }) => {
        if (onSort) {
            onSort(sortBy);
        }
    };

    const _rowGetter = ({ index }: { index: number }) => data[index];

    const _onRowClick = ({ rowData }: { rowData: any }) => {
        if (onRowClick) {
            onRowClick(rowData);
        }
    };

    return (
        <div className="flex-1 h-full w-full min-h-[400px]">
            <style>{tableStyles}</style>
            <AutoSizer>
                {({ width, height }) => (
                    <Table
                        width={width}
                        height={height}
                        headerHeight={headerHeight}
                        rowHeight={rowHeight}
                        rowCount={data.length}
                        rowGetter={_rowGetter}
                        onRowClick={_onRowClick}
                        sort={_sort}
                        sortBy={sortConfig?.key}
                        sortDirection={sortConfig?.direction === 'asc' ? SortDirection.ASC : SortDirection.DESC}
                        className="outline-none" // Remove focus outline
                    >
                        {columns.map((col, index) => (
                            <Column
                                key={col.dataKey || index}
                                label={col.label}
                                dataKey={col.dataKey}
                                width={col.width || 100}
                                flexGrow={col.flexGrow ?? 1}
                                headerRenderer={col.sortable ? headerRenderer : undefined}
                                cellRenderer={({ cellData, rowData }) => {
                                    if (col.cellRenderer) {
                                        return col.cellRenderer(cellData, rowData);
                                    }
                                    return <span className="text-gray-300 text-sm">{cellData}</span>;
                                }}
                            />
                        ))}
                    </Table>
                )}
            </AutoSizer>
        </div>
    );
};
