import React, { useState } from 'react'

export default function Navbar(props) {

    // state hooks for getting API parameters for the scheduled shows
    const [schedDate, setDate] = useState("2014-01-01");
    const [countryCode, SetCountry] = useState("US")

    let submitParams = (e) => {
        e.preventDefault();
        props.saveApiParams(schedDate, countryCode);
    }

    
    return (
        <div>
            <nav className="navbar navbar-expand topBar shadow-lg bg-info">
                <h1 className="navbar-brand text-white">Rocket Grid</h1>
                <form className="ml-auto" onSubmit={submitParams}>
                    <ul className="navbar-nav">
                        <li className="nav-item text-white pt-1">Select Country and Date:&nbsp;</li>
                        <li className="nav-item">
                            <input type="date" min="2010-01-01" max="2019-12-31" value={schedDate} name="schedDate" className="form-control" onChange={event => setDate(event.target.value)} />
                        </li>
                        <li className="nav-item ml-2">
                            <select className="form-control" value={countryCode} onChange={event => SetCountry(event.target.value)}>
                                <option value="CA">Canada</option>
                                <option value="GB">UK</option>
                                <option value="US">USA</option>
                            </select>
                        </li>
                        <li className="nav-item">
                            <input type="submit" className="btn btn-success ml-2 border-warning" value="Go" />
                        </li>
                    </ul>
                </form>
            </nav>
        </div>
    )
}
