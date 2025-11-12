import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import styles from "./TableWidget.module.css";

const TableWidget = ({
  columns,
  data,
  onSelectRow,
  pageIndex,
  setPageIndex,
  pageSize = 10,
  totalData, // optional; defaults to data.length
  // NEW: decouple actions from the table
  onRowUpdateClick,                 // (row) => void
  renderRowActions,                 // (row) => ReactNode (optional custom actions cell)
}) => {
  // Derive totals and paging
  const total = typeof totalData === "number" ? totalData : data.length;
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  // Clamp page index if data shrinks
  useEffect(() => {
    const maxPage = Math.max(totalPages - 1, 0);
    if (pageIndex > maxPage) setPageIndex(maxPage);
  }, [totalPages, pageIndex, setPageIndex]);

  // Slice data for the current page
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const pagedData = useMemo(() => data.slice(start, end), [data, start, end]);

  // Build table with only current page rows
  const table = useReactTable({
    data: pagedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Header checkbox (page scope)
  const allSelected =
    table.getRowModel().rows.length > 0 &&
    table.getRowModel().rows.every((r) => r.original.isSelected);

  const isIndeterminate =
    table.getRowModel().rows.some((r) => r.original.isSelected) && !allSelected;

  const headerCheckboxRef = useRef(null);
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  // pagination disabled states
  const prevDisabled = pageIndex === 0;
  const nextDisabled = pageIndex + 1 >= totalPages;

  return (
    <div className={styles.table_wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkbox_cell}>
              <input
                type="checkbox"
                ref={headerCheckboxRef}
                className={styles.custom_checkbox}
                checked={allSelected}
                onChange={(e) => {
                  const checked = e.target.checked;
                  table.getRowModel().rows.forEach((r) =>
                    onSelectRow?.(r.original, checked)
                  );
                }}
              />
            </th>

            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <th key={header.id} className={styles.table_header}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))
            )}

            <th className={styles.table_header_empty}></th>
          </tr>
        </thead>

        <tbody className={styles.table_body}>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className={styles.table_row}>
              <td className={styles.checkbox_cell}>
                <input
                  type="checkbox"
                  className={styles.custom_checkbox}
                  checked={row.original.isSelected || false}
                  onChange={(e) => onSelectRow?.(row.original, e.target.checked)}
                />
              </td>

              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={styles.table_cell}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}

              <td className={styles.table_cell}>
                {typeof renderRowActions === "function" ? (
                  renderRowActions(row.original)
                ) : (
                  <button
                    type="button"
                    onClick={() => onRowUpdateClick?.(row.original)}
                    className={styles.update_btn}
                  >
                    Update
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination_content}>
        <span className={styles.pagination_content_left}>
          Showing{" "}
          <span className={styles.pagination_highlight}>
            {total === 0 ? 0 : start + 1} to {Math.min(end, total)}
          </span>{" "}
          of <span className={styles.pagination_highlight}>{total}</span> Entries
        </span>

        <div className={styles.pagination_content_right}>
          <span className={styles.pagination_info}>
            Page {total === 0 ? 0 : pageIndex + 1} of {totalPages}
          </span>

          <div className={styles.pagination_buttons}>
            <button
              type="button"
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={prevDisabled}
              className={`${styles.prevButton} ${
                prevDisabled ? styles.prevButtonDisabled : ""
              }`}
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() =>
                setPageIndex((prev) =>
                  prev + 1 < totalPages ? prev + 1 : prev
                )
              }
              disabled={nextDisabled}
              className={`${styles.nextButton} ${
                nextDisabled ? styles.nextButtonDisabled : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableWidget;
