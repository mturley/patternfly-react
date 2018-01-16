import React from 'react';

export const mockIconBarChildren = (
  <React.Fragment>
    <li className="drawer-pf-trigger">
      <a className="nav-item-iconic">
        <span className="fa fa-bell" title="Notifications" />
        <span className="badge badge-pf-bordered" />
      </a>
    </li>
    <li className="dropdown">
      <a className="dropdown-toggle nav-item-iconic" id="dropdownMenu1">
        <span title="Help" className="fa pficon-help" />
        <span className="caret" />
      </a>
      <ul className="dropdown-menu">
        <li>
          <a href="#0">Help</a>
        </li>
        <li>
          <a href="#0">About</a>
        </li>
      </ul>
    </li>
    <li className="dropdown">
      <a
        href="#0"
        className="dropdown-toggle nav-item-iconic"
        id="dropdownMenu2"
      >
        <span title="Username" className="fa pficon-user" />
        Brian Johnson <span className="caret" />
      </a>
      <ul className="dropdown-menu">
        <li>
          <a href="#0">Preferences</a>
        </li>
        <li>
          <a href="#0">Logout</a>
        </li>
      </ul>
    </li>
  </React.Fragment>
);
