## About The Project

[![home-events-screenshot]](https://dodo-hosting.herokuapp.com/)

   Simple solution for your web-hosting needs, the app gives you the power to host and moderate, webinars like, events based on your needs. 


### Built With

* [Angular](https://angular.io)
* [WebRTC](https://webrtc.org)
* [Express](https://expressjs.com)
* [Socket.IO](https://socket.io)
* [Bootstrap](https://getbootstrap.com)


### Prerequisites
    
    Node - 14.1.0
    bcrypt - 5.0.0
    cookie-parser - ^1.4.5
    cors - ^2.8.5
    dotenv - ^8.2.0
    express - ^4.17.1
    jsonwebtoken - ^8.5.1
    mongoose -  ^5.10.11
    socket.io - ^3.0.4
    nodemon - ^2.0.6
    socket.io-client - ^3.0.3
    ngx-toastr - ^13.2.0
    rxjs - ~6.6.0
    angular - 10.1.7


### Installation


To get a local copy up and running follow these simple example steps.

 :one: Download the app or clone the repo:

   ```sh
:hash: git clone https://github.com/Iskren1990/event-hosting.git
   ```

 :two: Install NPM packages

In the root folder run: 

	```sh
:hash: npm run prod-install 
	```

By default the project uses port 3000.

 - to check if it is free for use:

   = In Windows open cmd and paste:

	```sh
:hash: netstat -aon | find '3000'
	```

   = In Linux paste in the terminal:

	```sh
:hash: sudo netstat -anp | grep ':3000 '
	```

If the port is in use by other software you can change it by:

 - open " .env " file located in " config " folder.
 - change the value " PORT " variable.
	
	PORT=xxxx

To start the server run:

	```sh
:hash: npm run start-dev
	```

## Getting Started


To start the server run:

	```sh
:hash: npm run start-dev
	```

After succesfull start you will see the URL on which you can access the app.


## Usage

[![event-page-screenshot]](https://dodo-hosting.herokuapp.com/)

[![share-screen-screenshot]](https://dodo-hosting.herokuapp.com/)


## Roadmap

See the [open issues](https://github.com/Iskren1990/event-hosting/issues) for a list of proposed features (and known issues).


## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## License

Distributed under the MIT License. See `LICENSE` for more information.


## Contact

Open a issue with request.


## Acknowledgements

* [Cool Random Guy](https://www.youtube.com/watch?v=JhyY8LdAQHU&list=PLK0STOMCFms4nXm1bRUdjhPg0coxI2U6h&index=3)



[home-events-screenshot] (images/screenshot.png)
[event-page-screenshot] (images/screenshot1.png)
[share-screen-screenshot] (images/screenshot2.png)