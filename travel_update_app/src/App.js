import * as React from 'react';
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const columns = [
  {
      name: 'ID',
      selector: row => row.id,
      sortable:true,
      width: '100px'
  },
  {
      name: 'Cover Image',
      selector: row => row.coverimage,
      cell: row => <img src={row.coverimage} width={100} alt={row.name}></img>,
      width: '150px'
  },
  {
      name: 'Name',
      selector: row => row.name,
      sortable:true,
      width: '150px'
  },
  {
    name: 'Detail',
    selector: row => row.detail,
    sortable:true,
    width: '750px'
  },
  {
    name: 'Latitude',
    selector: row => row.latitude,
    sortable:true
  },
  {
    name: 'Longitude',
    selector: row => row.longitude,
    sortable:true
  },
];


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function App() {

  const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
  const [page, setPage]  = useState(1);
	const [perPage, setPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState('');
  const [sortColumnDir, setSortColumnDir] = useState('');
  const [search, setSearch] = useState('');

	const fetchData = async () => {
		setLoading(true);
    var url = `http://localhost:3333/attractions?page=${page}&per_page=${perPage}`;
    if(search){
      url += `&search=${search}`;
    }
    if(sortColumn){
      url += `&sortColumn=${sortColumn}&sortColumnDir=${sortColumnDir}`;
    }
		const response = await axios.get(url);

		setData(response.data.data);
		setTotalRows(response.data.total);
		setLoading(false);
	};

	const handlePageChange = page => {
		setPage(page);
	};

	const handlePerRowsChange = async (newPerPage, page) => {
		setPerPage(newPerPage);
	};

  const handleSort = (column, sortDirection) => {
		console.log(column, sortDirection);
    setSortColumn(column.name);
    setSortColumnDir(sortDirection);
	};

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchData();
  }

	useEffect(() => {
		fetchData(); 
	}, [page, perPage, sortColumn, sortColumnDir]);

	return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8} lg={12}>
            <Item>
              <form onSubmit={handleSearchSubmit}>
                <label>
                  Search :
                  <input type="text" name="search" placeholder='Try words' onChange={handleSearchChange}/>
                </label>
                <input type="submit" value="Submit" />
              </form>
            </Item>
          </Grid>
        </Grid>
      </Box>
      <DataTable
        title="Users"
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onSort={handleSort}
		  />
    </div>
	);
}

export default App;
