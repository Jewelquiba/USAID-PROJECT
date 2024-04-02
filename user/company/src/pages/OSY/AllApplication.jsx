import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { renderStatus } from '../../components/lib/consts/renderers/renderStatus';
import ViewApplicantCard from '../../components/ViewApplicantCard';
import { apiRequest } from '../../utils';
import { useSelector } from 'react-redux';

const columns = [
  { field: 'companyName', headerName: 'Company', minWidth: 200, flex: 1 },
  {
    field: 'hiringStage',
    headerName: 'Hiring Stage',
    type: 'singleSelect',
    renderCell: renderStatus,
    minWidth: 150,
    flex: 1,
    valueOptions: ({ row }) => {
      if (row === 'Interview') {
        return (
          <div className="border p-3 border-dark-yellow">
            <span className="text-dark-yellow">{row}</span>
          </div>
        );
      }
    },
  },
  { field: 'appliedDate', headerName: 'Applied Date', minWidth: 200, flex: 1 },
  { field: 'jobRole', headerName: 'Job Role', minWidth: 200, flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    minWidth: 200,
    flex: 1,
    valueGetter: () => 'See Profile',
  },
];

export default function AllApplication() {
  const { user } = useSelector((state) => state.user);
  const [tableData, setTableData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getUser = async () => {
    try {
      const res = await apiRequest({
        url: '/users/get-user/' + user._id,
        method: 'GET',
      });
      setTableData(res.data.application);
    } catch (error) {
      console.log(error);
    }
  };

    useEffect(() => {
    getUser()
    // fetch("src/components/lib/consts/dummy/dummy_table.json") // Verify the path to your JSON file
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error(
    //         `Network response was not ok: ${response.statusText}`
    //       );
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     setTableData(data);
    //   })
    //   .catch((error) => {
    //     console.error("Error loading data:", error);
    //   });
  }, [])

  const onCellClick = ({ field, row }) => {
    if (field === 'action') {
      row.user['resume'] = row.resume;
      setUserInfo(row.user);
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="flex flex-col p-3 gap-5" style={{ height: 'calc(100vh - 5rem)' }}>
        <div>
          <span className="text-3xl font-black">
            Total Jobs Applied: {tableData.length}
          </span>
        </div>
        <div style={{ height: 'calc(100% - 3rem)' }}>
          <DataGrid
            rows={tableData}
            columns={columns}
            pagination
            pageSize={10}
            components={{ Toolbar: GridToolbar }}
            onCellClick={onCellClick}
          />
        </div>
      </div>
      <div onClick={() => setShowModal(false)}>
        <ViewApplicantCard
          userInfo={userInfo}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </div>
    </>
  );
}
