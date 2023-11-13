import { useQuery } from 'react-query';
import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { sortBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { Button, Col, ControlLabel, FormControl, FormGroup, Grid, Modal, Panel, Row } from 'react-bootstrap';
import { faAppleAlt, faBathtub, faShieldCat, faShieldDog } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { DateTime } from 'luxon';
import { ErrorMessage, Field, Form as FormikForm, Formik } from 'formik';
import { Link } from 'react-router-dom';

const DUMMY_API = 'https://dummy.restapiexample.com/api/v1/employees';

/*
  This is a canary in the coal mine.
  If this page breaks, than the "new core" is broken
  I'm hoping the dependencies will work together at least initially

  Make sure all of these are used below:
    "@fortawesome/fontawesome-svg-core": "^6.4.2",
    "@fortawesome/free-regular-svg-icons": "^6.4.2",
    "@fortawesome/free-solid-svg-icons": "^6.4.2",
    "@fortawesome/react-fontawesome": "^0.2.0",
    TODO "@testing-library/jest-dom": "^6.1.4",
    TODO "@testing-library/react": "^14.0.0",
    TODO "@testing-library/user-event": "^14.5.1",
    TODO "@types/jest": "^29.5.6",
    "@types/node": "^20.8.9",
    "ag-grid-community": "^30.2.0",
    "ag-grid-react": "^30.2.0",
    "axios": "^1.5.1",
    CHANGED TO AN OLD VERSION "bootstrap": "XXXXX",
    "formik": "^2.4.5",
    "i18next": "^23.6.0",
    "lodash": "^4.17.21",
    "luxon": "^3.4.3",
    "react": "^18.2.0",
    CHANGED TO AN OLD VERSION "react-bootstrap": "XXXXX",
    "react-dom": "^18.2.0",
    "react-i18next": "^13.3.1",
    "react-query": "^3.39.3",
    "react-router": "^6.17.0",
    "react-select": "^5.7.7"
 */

type DummyEmployeeResponse = {
  data: DummyEmployee[]
}

type DummyEmployee = {
  id: number
  employee_name: string
}

const getColumns = (employeeHeaderName) => {
  return [
    {
      field: 'employee_name',
      headerName: employeeHeaderName,
    },
    {
      field: 'id',
      headerName: 'ID',
    },
  ];
};

const PageWithLotsOfReactComponents = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery(
    ['SimpleChildSummary'],
    async () => {
      const response = await axios.get<AxiosResponse<DummyEmployeeResponse>>(DUMMY_API);
      const data = response.data;
      // Lodash
      return sortBy(data.data, 'age');
    },
  );
  const [columns] = useState(getColumns(t('reactThings.EMPLOYEE_NAME')));

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (isLoading) {
    return <div>Loading</div>;
  }

  const options = [
    {
      label: 'One',
      value: 1,
    },
    {
      label: 'Two',
      value: 2,
    },
    {
      label: 'Three',
      value: 3,
    },
    {
      label: 'Four',
      value: 4,
    },
  ];

  const dateString = DateTime.now().toFormat('d MMM yyyy');

  console.log('translating', t('hi'));

  return (
    <Grid>
      <Row>
        <Col xs={6}>
          <h1>React Things</h1>
          <Panel>
            <Panel.Body>
              <ul>
                {/* TODO do this without reloadDocument */}
                <li><Link reloadDocument to={'/#!/simple-angular-page?id=7'}>React Router link to Angular page</Link>
                </li>
                <li><Link to={'/simple-wrapped-angular-component'}>React Router link to React page</Link></li>
              </ul>
            </Panel.Body>
          </Panel>
          <Panel>
            <Panel.Body>
              <div>
                Some font awesome icons:
                <FontAwesomeIcon className={'ps-2'} icon={faAppleAlt} />
                <FontAwesomeIcon className={'ps-2'} icon={faBathtub} />
                <FontAwesomeIcon className={'ps-2'} icon={faShieldCat} />
                <FontAwesomeIcon className={'ps-2'} icon={faShieldDog} />
              </div>
            </Panel.Body>
          </Panel>
          <Panel>
            <Panel.Body>
              <div>Date from Luxon: {dateString}</div>
            </Panel.Body>
          </Panel>
          <Panel>
            <Panel.Body>
              <div>
                Modal button:<Button variant='primary' onClick={handleShow}>
                Launch demo modal
              </Button>
              </div>
            </Panel.Body>
          </Panel>
          <Panel>
            <Panel.Body>
              <div>
                Select:<Select options={options} menuPortalTarget={document.body} />
              </div>
            </Panel.Body>
          </Panel>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={handleClose}>
                Close
              </Button>
              <Button variant='primary' onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          <Panel>
            <Panel.Body>
              <Formik initialValues={{ 'aField': '' }} onSubmit={(thing) => alert(JSON.stringify(thing))}>
                <FormikForm>
                  <Row>
                    <Col>
                      <h3 className='text-center font-weight-bold'>{t('reactThings.FORM_TITLE')}</h3>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={10}>
                      <FormGroup>
                        <ControlLabel>
                          A label for 'aField'
                        </ControlLabel>
                        <Field
                          as={FormControl}
                          type='text'
                          name={'aField'}
                          key={'aField'}
                        />
                        <ErrorMessage name={'aField'}>
                          {(errorMessage) => {
                            console.log('custom error message', errorMessage);
                            return <CustomErrorMessage errorMessage={errorMessage} />;
                          }}
                        </ErrorMessage>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button className='my-2 float-end' variant='primary' type='submit'>
                    Formik Submit
                  </Button>
                </FormikForm>
              </Formik>
            </Panel.Body>
          </Panel>
          <Panel>
            <Panel.Body>
              <div className='ag-theme-alpine' style={{ height: 400, width: '100%' }}>
                <AgGridReact
                  rowData={data}
                  columnDefs={columns}
                >
                </AgGridReact>
              </div>
            </Panel.Body>
          </Panel>
        </Col>
      </Row>
    </Grid>
  );
};

export default PageWithLotsOfReactComponents;