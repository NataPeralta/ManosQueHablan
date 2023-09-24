import {Textarea, ListItem, Text, Container, Stack, Heading, Box, StackDivider, List, SimpleGrid, TableContainer, Table, Thead, Tr, Th, Tbody, Td} from "@chakra-ui/react";
import DeletePayment from "../components/DeletePayment.jsx";
import CreatePayment from "../components/CreatePayment.jsx";
import DeleteStudent from "../components/DeleteStudent.jsx";
import EditPayment from "../components/EditPayment.jsx";
import EditStudent from "../components/EditStudent.jsx";
import {useParams} from "react-router-dom";
import "alertifyjs/build/css/alertify.css";
import React, {useState, useEffect} from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://manos-que-hablan-db.onrender.com");

const UserProfile = () => {
  const {studentId} = useParams();
  const [studentData, setStudentData] = useState(null);
  const [allPayments, setAllPayments] = useState([]);

  const fetchData = async () => {
    const studentPayments = await pb.collection("payments").getFullList({filter: `person="${studentId}"`});
    setAllPayments(studentPayments);
    const record = await pb.collection("students").getOne(studentId, {
      expand: "courses",
    });
    console.log(record);
    setStudentData(record);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!studentData) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <Container maxW={"7xl"} py={{base: 15, md: 50}}>
        {/* Student Info */}
        <SimpleGrid columns={{base: 1, lg: 2}} spacing={{base: 8, md: 10}}>
          <Stack spacing={{base: 6, md: 10}}>
            <Heading fontSize={{base: "2xl", sm: "4xl", lg: "5xl"}}>{studentData.name}</Heading>
            <Stack spacing={{base: 4, sm: 6}} direction={"column"} divider={<StackDivider />}>
              <Box>
                <Text fontSize={{base: "16px", lg: "18px"}} fontWeight={"500"} textTransform={"uppercase"} mb={"4"}>
                  Detalles del alumno:
                </Text>

                <List spacing={2}>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Documento:
                    </Text>
                    {studentData.document}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Dirección:
                    </Text>
                    {studentData.direction}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Email:
                    </Text>
                    {studentData.email}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Instagram:
                    </Text>
                    {studentData.instagram}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Teléfono:
                    </Text>
                    {studentData.phone}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Cursos:
                    </Text>
                    {studentData.expand.courses.map((course, index) => (
                      <React.Fragment key={course.id}>
                        <span>{course.name}</span>
                        {index !== studentData.expand.courses.length - 1 && ", "}
                      </React.Fragment>
                    ))}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Comentarios:
                    </Text>
                    <Textarea placeholder="Comentarios" defaultValue={studentData.richtext} readOnly />
                  </ListItem>
                </List>
              </Box>
            </Stack>
          </Stack>
          <Stack direction={["column"]}>
            <EditStudent student={studentData} />
            <DeleteStudent student={studentData.id} />
          </Stack>
        </SimpleGrid>

        <Box pt={{base: 30, md: 50}}>
          <CreatePayment studentData={studentData} studentId={studentId} />

          <TableContainer id="paymentsProfile">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Dia de pago</Th>
                  <Th>Monto</Th>
                  <Th>Cuenta</Th>
                  <Th>Concepto</Th>
                  <Th>Modalidad</Th>
                  <Th>Comprobante de Transferencia</Th>
                  <Th>Factura</Th>
                  <Th>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {allPayments.map((payment) => (
                  <Tr key={payment.id}>
                    <Td>
                      <Text>{payment.payday}</Text>
                    </Td>
                    <Td>
                      <Text>${payment.amount}</Text>
                    </Td>
                    <Td>
                      <Text>{payment.account}</Text>
                    </Td>
                    <Td>
                      <Text>{payment.concept}</Text>
                    </Td>
                    <Td>
                      <Text>{payment.modality}</Text>
                    </Td>
                    <Td>
                      <Text>{payment.billing}</Text>
                    </Td>
                    <Td>
                      <Text>{payment.invoice}</Text>
                    </Td>
                    <Td>
                      <Stack spacing={2} direction={{base: "row", md: "column"}} width={{base: "100%", md: "auto"}}>
                        <EditPayment payment={payment} />
                        <DeletePayment payment={payment} />
                      </Stack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
};

export default UserProfile;
