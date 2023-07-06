import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Table, TableBody, TableRow, TableCell, TableHead, IconButton, TextField } from '@material-ui/core';
import { Delete, PlayArrow, Stop, Undo, Print, CloudDownload } from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';

import GridContainer from '../../../@jumbo/components/GridContainer';
import PageContainer from '../../../@jumbo/components/PageComponents/layouts/PageContainer';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { fetchError, fetchStart, fetchSuccess } from '../../../redux/actions';
import Grid from '@material-ui/core/Grid';
import { $http, baseURL, mediaURL } from 'config';
import ToastMessage from '../../Components/ToastMessage';
import { useDispatch } from 'react-redux';
import CmtCard from '../../../@coremat/CmtCard';
import CmtImage from '../../../@coremat/CmtImage';
import PerfectScrollbar from 'react-perfect-scrollbar';

import CmtCardContent from '../../../@coremat/CmtCard/CmtCardContent';
import CmtCardHeader from '../../../@coremat/CmtCard/CmtCardHeader';
import makeStyles from '@material-ui/core/styles/makeStyles';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const breadcrumbs = [
  { label: <IntlMessages id={'sidebar.main'} />, link: '/' },
  { label: <IntlMessages id={'pages.detailPage'} />, isActive: true },
];

const useStyles = makeStyles(theme => ({
  cardRoot: {
    [theme.breakpoints.down('xs')]: {
      '& .Cmt-header-root': {
        flexDirection: 'column',
      },
      '& .Cmt-action-default-menu': {
        marginLeft: 0,
        marginTop: 10,
      },
    },
  },
  cardContentRoot: {
    padding: 0,
  },
  scrollbarRoot: {
    height: 275,
  },
}));

const DetailPage = props => {
  const classes = useStyles();
  const History = useHistory();
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [results, setResults] = useState(props.location.state.selectedImageURL);
  const [currentMidi, setCurrentMidi] = useState(0);

  const handleMessageClose = () => () => {
    setShowMessage(false);
  };

  const handlePlayMidi = id => {
    if (currentMidi == id) {
      setCurrentMidi(0);
    } else {
      setCurrentMidi(id);
    }
  };

  const handleGoBackClick = () => {
    History.push('/dashboard');
  };

  const handlePrintClick = () => {
    window.print();
  };

  const handleDownloadClick = () => {
    const input = document.getElementById('scan-table'); // Replace 'table-to-print' with the ID of your table element
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const img = new Image();
      img.src = imgData;

      img.addEventListener('load', function() {
        const imageHeight = img.naturalHeight;
        const imageWidth = img.naturalWidth;

        console.log('Image Height:', imageHeight);
        console.log('Image Width:', imageWidth);
        const pdf = new jsPDF();
        const width = pdf.internal.pageSize.getWidth();

        const height = (width * imageHeight) / imageWidth; //pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save('print.pdf');
      });
    });
  };

  return (
    <PageContainer heading={<IntlMessages id="pages.detailPage" />} breadcrumbs={breadcrumbs}>
      <GridContainer>
        <Grid xs={12}>
          <CmtCard className={classes.cardRoot}>
            <CmtCardHeader
              className="pt-4"
              title="Results"
              titleProps={{
                variant: 'h4',
                component: 'div',
              }}>
              <Box clone mx={4}>
                <Button color="primary" variant="contained" onClick={handlePrintClick}>
                  <Print />
                  <span className="ml-2">Print</span>
                </Button>
              </Box>
              <Box clone mx={4}>
                <Button color="primary" variant="contained" onClick={handleDownloadClick}>
                  <CloudDownload />
                  <span className="ml-2">Download</span>
                </Button>
              </Box>
              <Box clone mx={4}>
                <Button color="primary" onClick={handleGoBackClick}>
                  <Undo />
                  <span className="ml-2">Go Back</span>
                </Button>
              </Box>
            </CmtCardHeader>
            <CmtCardContent className={classes.cardContentRoot}>
              <div className="Cmt-table-responsive" id="scan-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Solution</TableCell>
                      <TableCell>Comment</TableCell>
                    </TableRow>
                  </TableHead>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="jr-card-thumb">
                          <CmtImage id={`second_image${result.id}`} src={result.image} style={{ objectFit: 'cover' }} />
                          {currentMidi && currentMidi == result.id ? (
                            <audio
                              src={`${mediaURL}${result.source}`}
                              controls
                              autoPlay={result.id == currentMidi ? true : false}></audio>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell style={{ padding: '0px' }}>
                        {result.source ? (
                          <IconButton style={{ marginLeft: 4 }} color="secondary" onClick={() => handlePlayMidi(result.id)}>
                            {result.id == currentMidi ? <Stop /> : <PlayArrow />}
                          </IconButton>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <TextField label="solution" multiline rows={4} />
                      </TableCell>
                      <TableCell>
                        <TextField label="comment" multiline rows={4} />
                      </TableCell>
                      {/* <TableCell>{result.solution ? result.solution : ''}</TableCell> */}
                    </TableRow>
                  ))}
                </Table>
              </div>
            </CmtCardContent>
          </CmtCard>
        </Grid>
      </GridContainer>
      {showMessage && <ToastMessage open={showMessage} onClose={handleMessageClose()} message={message} />}
    </PageContainer>
  );
};

export default DetailPage;
