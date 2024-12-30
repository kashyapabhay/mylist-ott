import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MyListService } from '../mylist/mylist.service';
import { UserService } from '../user/user.service';
import { MovieService } from '../movie/movie.service';
import { LoggerService } from '../logger/logger.service';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from 'src/user/user.dto';
dotenv.config();
interface WebSocketRequest {
    requestServiceName: string;
    requestAPIName: string;
    requestId: string;
    dataJson: string;
}

interface WebSocketResponse {
    requestServiceName: string;
    requestAPIName: string;
    requestId: string;
    responseBody: string;
}


@WebSocketGateway({

    cors: {
        origin: '*',
    },
}
)
export class WebSocketAPIGateway implements OnModuleInit, OnModuleDestroy, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    constructor(
        private readonly myListService: MyListService,
        private readonly userService: UserService,
        private readonly movieService: MovieService,
        private readonly loggerService: LoggerService,
    ) { }
    handleConnection(client: any, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client: any) {
        console.log(`Client disconnected: ${client.id}`);

    }

    onModuleInit() {
        console.log(`WebSocket server is initializing on default port`);
    }

    onModuleDestroy() {
        console.log('WebSocket server is shutting down');
    }

    @SubscribeMessage('apiRequest')
    async handleAPIRequest(@MessageBody() message: WebSocketRequest, @ConnectedSocket() client: Socket): Promise<void> {
        const { requestServiceName, requestAPIName, requestId, dataJson } = message;
        let responseBody;

        console.log(`Received request: ${JSON.stringify(message)}`);

        try {
            switch (requestServiceName) {
                case 'MyListService':
                    responseBody = await this.handleMyListService(requestAPIName, dataJson);
                    break;
                case 'UserService':
                    responseBody = await this.handleUserService(requestAPIName, dataJson);
                    break;
                case 'MovieService':
                    responseBody = await this.handleMovieService(requestAPIName, dataJson);
                    break;
                default:
                    throw new Error('Unknown service');
            }

            const response: WebSocketResponse = {
                requestServiceName,
                requestAPIName,
                requestId,
                responseBody,
            };

            console.log(`Sending response: ${JSON.stringify(response)}`);
            client.emit('apiResponse', response);
        } catch (error) {
            console.error(`Error handling request: ${(error as Error).message}`);
            client.emit('apiError', { requestId, error: (error as Error).message });
        }
    }

    private async handleMyListService(apiName: string, data: any): Promise<any> {
        switch (apiName) {
            case 'addToMyList':
                // return this.myListService.addToMyList(data.userId, data.contentId);
            case 'removeFromMyList':
                return this.myListService.removeFromMyList(data.userId, data.contentId);
            case 'listMyItems':
                return this.myListService.listMyItems(data.userId, data.page);
            default:
                throw new Error('Unknown API name');
        }
    }

    private async handleUserService(apiName: string, data: string): Promise<any> {
        console.log(`apiName: ${apiName} data : ${JSON.stringify(data)}`);
        switch (apiName) {
            case 'createUser':
                console.log(`Going to create user`);
                const createUserDto = plainToClass(CreateUserDto, data);
                console.log(`Create user dto: ${createUserDto.username }`);
                return this.userService.addUser(createUserDto);
            // case 'updateUser':
            //     return this.userService.update(data.id, data.updateUserDto);
            // case 'findUser':
            //     return this.userService.findOne(data.id);
            default:
                throw new Error('Unknown API name');    
        }
    }

    private async handleMovieService(apiName: string, data: any): Promise<any> {
        switch (apiName) {
            // case 'createMovie':
            //     return this.movieService.create(data.createMovieDto);
            // case 'updateMovie':
            //     return this.movieService.updateMovie(data.id, data.updateMovieDto);
            // case 'deleteMovie':
            //     return this.movieService.deleteMovie(data.id);
            default:
                throw new Error('Unknown API name');
        }
    }

    
}