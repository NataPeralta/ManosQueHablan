import React, {useState, useEffect} from "react";
import PocketBase from "pocketbase";
import {Center, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {Link} from "react-router-dom";

const pb = new PocketBase("https://manos-que-hablan-db.onrender.com");

const UserList = () => {
  const [allStudents, setAllStudents] = useState([]);

  const showData = async () => {
    const records = await pb.collection("students").getFullList({
      expand: "courses",
    });
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
              <Th>Nombre</Th>
              <Th>Documento</Th>
              <Th>Cursos inscripto</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allStudents.map((student) => (
              <Tr key={student.id}>
                <Td>
                  <Link to={`/students/${student.id}`}>{student.name}</Link>
                </Td>
                <Td>{student.document}</Td>
                <Td>
                  {student.expand.courses.map((course, index) => (
                    <React.Fragment key={course.id}>
                      <Link to={`/courses/${course.id}`}>{course.name}</Link>
                      {index !== student.expand.courses.length - 1 && ", "}
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
