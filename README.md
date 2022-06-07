![Perth Toilets.](/docs/images/LogoWithText.png)

## What is Perth Toilets?
Well..... it's a joke website that will make it simple to find a nice public toilet in the Perth CBD.

#### Pre-Requisites
- [Docker](https://www.docker.com/)
- [Docker-Compose](https://docs.docker.com/compose/install/)
#### Clone the Repo
Clone the project to your local machine,
````
git clone git@github.com:Cybericecream/perth-toilets.git
````
Then follow through and navigate to the project, presuming you didn't change the file location name,
````
cd perth-toilets
````
#### Run the Project
Running the following command will bring up the project is in a terminal window
````
docker-compose up --build
````
If you want to run it and not view the logs, run the following instead
````
docker-compose up --build -d
````
#### Setting up the dev url in the hosts
Working on the project is easier when you designate a local url to navigate to, add the following to your hosts directory.
````
127.0.0.1       perth-toilts.d3v
127.0.0.1       api.perth-toilets.d3v
````
The above will point our project to localhost where nginx will listen for a request.
##### How to
[Windows](https://www.onmsft.com/how-to/how-to-modify-your-hosts-file-in-windows-10-and-why-you-might-want-to)
- [MacOS](https://setapp.com/how-to/edit-mac-hosts-file)
- [Linux (Ubuntu)](https://websiteforstudents.com/how-to-edit-the-local-hosts-file-on-ubuntu-18-04-16-04/)

#### Go to site
Presuming all the above went as expected go to [perth-toilets.d3v](http://perth-toilets.d3v)

### Stack
DB: Postgres

Backend: TypeScript Node
- Express JS

Base
- Docker
- API Documentation
- Database Layer

[Docker reference Docs](/docs/docker/dockerStructure.md)