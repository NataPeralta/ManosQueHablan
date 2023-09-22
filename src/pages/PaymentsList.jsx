import PocketBase from "pocketbase";
import {Link} from "react-router-dom";
import "alertifyjs/build/css/alertify.css";
import {useState, useEffect} from "react";
import {Center, Heading, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, Stack} from "@chakra-ui/react";
import EditPayment from "../components/EditPayment.jsx";
import DeletePayment from "../components/DeletePayment.jsx";
import CreatePayment from "../components/CreatePayment.jsx";

const pb = new PocketBase("https://manos-que-hablan-db.onrender.com");

const PaymentsList = () => {
  const [allPayments, setAllPayments] = useState([]);

  const showData = async () => {
    const listPayments = await pb.collection("payments").getFullList();
    const listStudents = await pb.collection("students").getFullList();

    const mapListStudents = new Map(listStudents.map((student) => [student.id, student]));
    const listPaymentsFormat = listPayments.map((payment) => ({
      ...payment,
      payday: new Date(payment.payday).toLocaleDateString("es-AR", {day: "2-digit", month: "2-digit", year: "2-digit"}),
    }));
    const listPaymentsWithUsers = listPaymentsFormat.map((payment) => {
      const student = mapListStudents.get(payment.person);
      return student ? {...payment, personId: student.id, personName: student.name} : payment;
    });
    setAllPayments(listPaymentsWithUsers);
  };


  if (!allPayments) {
    return <p>Cargando...</p>;
  }

  useEffect(() => {
    showData();
  }, [allPayments]);

  return (
    <div className="App">
      <Center>
        <Heading as="h1" size="2xl">
          Pagos
        </Heading>
      </Center>

      <CreatePayment />

      <TableContainer>
        <Table id="payments">
          <Thead>
            <Tr>
              <Th>Dia de pago</Th>
              <Th>Estudiante</Th>
              <Th>Monto</Th>
              <Th>Cuenta</Th>
              <Th>Concepto</Th>
              <Th>Modalidad</Th>
              <Th>Nro. de Transferencia</Th>
              <Th>Nro. de Factura</Th>
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
                  <Link to={`/students/${payment.personId}`}>{payment.personName}</Link>
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
    </div>
  );
};

export default PaymentsList;






