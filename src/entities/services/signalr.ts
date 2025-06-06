import  {  HubConnectionBuilder, HubConnection, LogLevel, HttpTransportType} from '@microsoft/signalr'; 

//класс для взаимодействия с сокетом
type Events = "MessageCreated" | "ChannelCreated" | "CommunityMemberAdded";

class SignalRClient {
  private connection: HubConnection
  private url: URL
  constructor(url: string) {
    //создаем соединение с signalR
    this.url = new URL(url)
    this.connection = new HubConnectionBuilder()
      .withUrl(url, {
        skipNegotiation: true,  // skipNegotiation as we specify WebSockets
        transport: HttpTransportType.WebSockets
      })
    .configureLogging(LogLevel.Error)
    .build()
  }

  public on(evnetName:Events, callback: (...args: any[]) => any) {
    this.connection.on(evnetName, callback)
  }

  public off(evnetName:Events, callback: (...args: any[]) => any) {
    this.connection.off(evnetName, callback)
  } 
  
  public async startingConnection(token: string) {
    this.url.searchParams.set("access-token", token)
    this.connection.baseUrl = this.url.toString()
    await this.connection.start();
  }

  public async reconnect() {
    this.connection.stop()
    this.connection.start()
  }

  public async closeConnection() {
    await this.connection.stop();
  }
}

export default SignalRClient