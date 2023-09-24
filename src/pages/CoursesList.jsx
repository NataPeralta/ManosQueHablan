import {useState, useEffect} from "react";
import PocketBase from "pocketbase";
import {Button, Card, CardBody, CardFooter, CardHeader, Center, Heading, SimpleGrid, Text} from "@chakra-ui/react";
import {Link} from "react-router-dom";

const pb = new PocketBase("http://127.0.0.1:8090");

const CoursesList = () => {
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const courseList = await pb.collection("courses").getFullList();
      
      setCoursesList(courseList);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Center>
        <Heading as="h1" size="2xl">
          Lista de cursos
        </Heading>
      </Center>

      {loading ? (
        <Center mt={4}>
          <Text>Cargando...</Text>
        </Center>
      ) : (
        <SimpleGrid spacing={4} columns={{sm: 1, md: 2, lg: 3}}>
          {coursesList.map((course) => (
            <Card key={course.id} h="100%">
              <CardHeader>
                <Heading size="md">{course.name}</Heading>
              </CardHeader>
              <CardBody>
                <Text>{course.description}</Text>
              </CardBody>
              <CardFooter>
                <Link to={`/courses/${course.id}`}>
                  <Button colorScheme="teal">Ver detalles</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </div>
  );
};

export default CoursesList;
