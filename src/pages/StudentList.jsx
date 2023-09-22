import React, {useState, useEffect} from "react";
import PocketBase from "pocketbase";
import {Center, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {Link} from "react-router-dom";
const pb = new PocketBase("https://manos-que-hablan-db.onrender.com");

const UserList = () => {
  const [allStudents, setAllStudents] = useState([]);

  const showData = async () => {
    const records = await pb.collection("students").getFullList();
    setAllStudents(records);
  };

  useEffect(() => {
    showData();
  }, []);

  return (
    <div className="App">
      <Center>
        <Heading as="h1" size="2xl">
          Estudiantes
        </Heading>
      </Center>

      <TableContainer id="students">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Nombre</Th>
              <Th>Cursos inscripto</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allStudents.map((student) => (
              <Tr key={student.id}>
                <Td>{student.id}</Td>
                <Td>
                  <Link to={`/students/${student.id}`}>{student.name}</Link>
                </Td>
                <Td>
                  {student.attends.map((attend, index) => (
                    <React.Fragment key={attend}>
                      <Link to={`/courses/${attend}`}>{attend}</Link>
                      {index !== student.attends.length - 1 && ", "}
                    </React.Fragment>
                  ))}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserList;
