import Actions from "../countryAction";

export const countryTableColumn = (currentPage, rowsPerPage) => [
  {
    name: "#",
    selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
    sortable: false,
    width: "60px",
  },
  {
    name: "Country Name",
    width: "300px",
    selector: (row) => row.name,
    sortable: true,
    cell: (row) => <div className="truncate-text">{row.name}</div>,
  },
  {
    name: "Code",
    selector: (row) => row.code,
    sortable: true,
  },
  {
    name: "Currency",
    selector: (row) => row.currency,
    sortable: true,
  },
  {
    name: "Symbol",
    selector: (row) => row.symbol,
    sortable: true,
  },
  {
    name: "Actions",
    ignoreRowClick: true,
    allowOverflow: true,
    cell: (row) => (
      <div className="d-flex">
        <Actions row={row} />
      </div> 
    ),
  },
];
