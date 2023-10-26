import { useQuery } from 'react-query';
import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { sortBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { faAppleAlt, faBathtub, faShieldCat, faShieldDog } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { DateTime } from 'luxon';
import { ErrorMessage, Field, Form as FormikForm, Formik } from 'formik';

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
    "bootstrap": "^5.3.2",
    "formik": "^2.4.5",
    "i18next": "^23.6.0",
    "lodash": "^4.17.21",
    "luxon": "^3.4.3",
    "react": "^18.2.0",
    "react-bootstrap": "^2.9.1",
    "react-dom": "^18.2.0",
    "react-i18next": "^13.3.1",
    "react-query": "^3.39.3",
    TODO "react-router": "^6.17.0",
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
  const [columns] = useState(getColumns(t('EMPLOYEE_NAME' as any)));

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

  return <div>
    <div>
      Some font awesome icons:
      <FontAwesomeIcon icon={faAppleAlt} />
      <FontAwesomeIcon icon={faBathtub} />
      <FontAwesomeIcon icon={faShieldCat} />
      <FontAwesomeIcon icon={faShieldDog} />
    </div>
    <div>Date from Luxon: {dateString}</div>
    <div>
      Modal button:<Button variant='primary' onClick={handleShow}>
      Launch demo modal
    </Button>
    </div>
    <div>
      Select:<Select options={options} menuPortalTarget={document.body} />
    </div>
    <div className='ag-theme-alpine' style={{ height: 400, width: 600 }}>
      Grid:
      <AgGridReact
        rowData={data}
        columnDefs={columns}
      >
      </AgGridReact>
    </div>

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
    <Formik initialValues={{ 'aField': ''}}  onSubmit={(thing)=>alert(JSON.stringify(thing))}>
      <FormikForm>
        <Container>
          <Row>
            <Col>
              <h1 className='text-center font-weight-bold'>{t('beckResult.DETAIL_TITLE' as any)}</h1>
            </Col>
          </Row>
          <Row className={'shadow'}>
            <Col sm={10}>
              <Form.Group as={Row}>
                <Form.Label>
                  A label
                </Form.Label>
                <Col>
                  <Field
                    as={Form.Control}
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
                </Col>
              </Form.Group>
            </Col>
          </Row>
        <Button className="my-2" variant="primary" type="submit">
          Formik Submit
        </Button>
        </Container>
      </FormikForm>
    </Formik>
  </div>;
};

export default PageWithLotsOfReactComponents;