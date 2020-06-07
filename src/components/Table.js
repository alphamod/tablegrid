import React, { useState, useEffect } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import axios from 'axios'

export default function Table(props) {

    const [cCode, setcCode] = useState(props.cCode);
    const [schedDate, setschedDate] = useState(props.schedDate);
    const [data, setData] = useState([]);
    const [filterInput, setFilterInput] = useState("");
    const [filterCheckInput, setFilterCheckInput] = useState([]);
    const [tableStyle, setTableStyle] = useState({ "width": "100%" });
    const [paneStyle, setPaneStyle] = useState({ "display": "none" });
    const [iniStateSort, setIniStateSort] = useState({ id: "", desc: "" });

    // toggle layout whenever props change
    useEffect(() => {
        if (props.layoutVar === "false") {
            setTableStyle({ "width": "100%" });
            setPaneStyle({ "display": "none" });
        } else if (props.layoutVar === "true") {
            setTableStyle({ "width": "70%" });
            setPaneStyle({ "display": "block", "width": "30%" });
        }
        if (localStorage.getItem("sortObj")) {
            const localStorSort = localStorage.getItem("sortObj");
            setIniStateSort(JSON.parse(localStorSort));
        }
        if (localStorage.getItem("filterCheckBox")) {
            const filterCheckStorage = JSON.stringify(localStorage.getItem("filterCheckBox"));
            
        }

        if (localStorage.getItem("filterText")) {
            const filterTextStorage = localStorage.getItem("filterText")
            setTimeout(() => {
                setFilter("show.name", filterTextStorage || undefined);
            }, 2000)
            setFilterInput(filterTextStorage);
            setTableStyle({ "width": "70%" });
            setPaneStyle({ "display": "block", "width": "30%" });
            
        }
    }, [props]);


    // filter function for textbox element
    const filterPaneInput = (event) => {
        setFilter("show.name", event.target.value || undefined);
        localStorage.setItem("filterText", event.target.value);
        setFilterInput(event.target.value);
    }

    // filter function for checkbox elements
    const inputCheckBoxes = (event) => {
        const filterObj = { "id": event.target.name, "value": event.target.value }
        if (event.target.checked) {
            filterCheckInput.push(filterObj);
            console.log(filterCheckInput);
        } else {
            filterCheckInput.splice(filterObj, 1);
        }

        localStorage.setItem("filterCheckBox", JSON.stringify(filterObj));
        setAllFilters(filterCheckInput);
    }

    // getting data from API with params 
    useEffect(() => {
        setcCode(props.cCode);
        setschedDate(props.schedDate);
        (async () => {
            const url = `https://api.tvmaze.com/schedule?country=${cCode}&date=${schedDate}`
            const result = await axios(url)
            setData(result.data);
            
        })();
    }, [props, cCode, schedDate]);

    const Genre = ({ values }) => {
        return (
            <div>
                {values.map((genre, idx) => {
                    return (
                        <span key={idx} className="badge bg-info mr-1 text-white">
                            {genre}
                        </span>
                    )
                })}
            </div>
        )
    }

    // table schema
    const columns = React.useMemo(
        () => [
            {
                Header: "Network Name",
                accessor: "show.network.name",
                disableSortBy: true,
            },
            {
                Header: "Show Name",
                accessor: "show.name",
                disableSortBy: false,
            },
            {
                Header: "Episode Name",
                accessor: "name",
                disableSortBy: false,
            },
            {
                Header: "Season",
                accessor: "season",
                disableSortBy: true,
            },
            {
                Header: "Episode",
                accessor: "number",
                disableSortBy: true,
            },
            {
                Header: "Air TIme",
                accessor: "airtime",
                disableSortBy: false,
            },
            {
                Header: "Language",
                accessor: "show.language",
                disableSortBy: false,
            },
            {
                Header: "Genre",
                accessor: "show.genres",
                disableSortBy: true,
                Cell: ({ cell: { value } }) => <Genre values={value} />
            },
        ], [])

    

    // table hooks
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setFilter,
        setAllFilters
    } = useTable({
        columns, data, initialState: {
            sortBy: [iniStateSort]
        }
    }, useFilters, useSortBy)

    // saving sort in local storage
    headerGroups.filter(ele => {
        ele.headers.filter(elem => {
            if (elem.isSorted) {
                // console.log(elem.id, elem.isSortedDesc);
                // console.log(elem);
                const sortObj = JSON.stringify({ "id": elem.id, "desc": elem.isSortedDesc })
                localStorage.setItem("sortObj", sortObj);
                return 0;
            }
        })
    });

    return (
        <div className="fixedTable d-flex">
            <table style={tableStyle} className="table table-hover table-striped mt-2 mb-0 mx-0 px-0" {...getTableProps()}>
                <thead className="bg-secondary text-center text-white">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th className={
                                    column.isSorted
                                        ? column.isSortedDesc
                                            ? "sortDesc"
                                            : "sortAsc"
                                        : ""
                                } {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody className="text-center" {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>

            </table>

            <div style={paneStyle} className="bg-info mt-2 filterPane">
                <input type="text" onChange={filterPaneInput} placeholder="Search by show name" value={filterInput} className="mx-auto w-75 my-4 form-control" />

                <div className="checkBoxes">
                    <label className="text-white text-center ml-2">Languages:</label>
                    <div className="form-check ">
                        <input type="checkbox" onChange={inputCheckBoxes} id="english" name="show.language" value="English" className="form-check-input" />
                        <label className="form-check-label text-white" htmlFor="english">English</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" onChange={inputCheckBoxes} id="french" name="show.language" value="French" className="form-check-input" />
                        <label className="form-check-label text-white" htmlFor="french">French</label>
                    </div>

                    <label className="text-white text-center ml-2">Genres:</label>
                    <div className="form-check ">
                        <input type="checkbox" onChange={inputCheckBoxes} id="drama" name="show.genres" value="Drama" className="form-check-input" />
                        <label className="form-check-label text-white" htmlFor="drama">Drama</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" onChange={inputCheckBoxes} id="fantasy" name="show.genres" value="Fantasy" className="form-check-input" />
                        <label className="form-check-label text-white" htmlFor="fantasy">Fantasy</label>
                    </div>
                </div>

            </div>
        </div>
    )
}
