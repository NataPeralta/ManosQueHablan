import {useState, useEffect} from "react";
import PocketBase from "pocketbase";
import {Center, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {Link, useParams} from "react-router-dom";
import EditCourses from "../components/EditCourses";

const pb = new PocketBase("http://127.0.0.1:8090");

const Attends = () => {
  const {coursesId: id} = useParams();
  const [courseData, setCourseData] = useState(null);
  const [allStudents, setAllStudents] = useState([]);

  const showData = async () => {
    const courseRecord = await pb.collection("courses").getOne(id);
    const studentsRecord = await pb.collection("students").getFullList({
      expand: "courses",
    });
    const filteredStudents = studentsRecord.filter((student) => {
      return student.expand.courses.some((course) => [id].includes(course.id));
    });

    setCourseData(courseRecord);
    setAllStudents(filteredStudents);
  };

  useEffect(() => {
    showData();
  }, []);

  return (
    <>
      <Center>
        <Heading as="h1" size="2xl">
          Estudiantes
        </Heading>
      </Center>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Nombre</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allStudents.map((student) => (
              <Tr key={student.id}>
                <Td>{student.id}</Td>
                <Td>
                  <Link to={`/students/${student.id}`}>{student.name}</Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <EditCourses allStudents={allStudents} courseData={courseData} />
    </>
  );
};

export default Attends;
