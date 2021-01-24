import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProgressWebsocketService} from '../../service/progress.websocket.service';
import {Avatar} from 'src/model/avatar';
import {ActivatedRoute} from '@angular/router';
import {MapService} from '../../service/map.service';
import {MapModel} from '../../../model/map';
import { AvatarService } from 'src/app/service/avatar.service';
import { Coord } from 'src/model/coord';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

  public title = 'Using WebSocket under Angular';
  private obs: any;
  public timer: string | undefined;
  public avatarList: Avatar[] | undefined;
  public lightList: Avatar[] | undefined;
  mapResponse: MapModel | undefined;

  constructor(
    private router: ActivatedRoute,
    private progressWebsocketService: ProgressWebsocketService,
    private mapService: MapService,
    private avatarService: AvatarService
  ) {
    router.params.subscribe(val => {
      this.initProgressWebSocket();
      this.mapService.getMapById(val.id).subscribe(map => {
          this.mapResponse = map;
          console.log(this.mapResponse);
          const coordsCroisements: Coord[] = [];
          const verticalRouteRegex = /route_vert/;
          const horizontalRouteRegex = /route_hor/;
          map.square?.forEach((row, y) => {
            row.forEach((col, x) => {
              if (/croisement.png$/.test(col.image || '')) {
                if (y > 0 && verticalRouteRegex.test(map.square![y-1][x].image || '')) {
                  coordsCroisements.push({x, y: y-1, isVertical: true});
                }
                if (y < 29 && verticalRouteRegex.test(map.square![y+1][x].image || '')) {
                  coordsCroisements.push({x, y: y+1, isVertical: true});
                }
                if (x > 0 && horizontalRouteRegex.test(map.square![y][x-1].image || '')) {
                  coordsCroisements.push({x: x-1, y});
                }
                if (x < 29 && horizontalRouteRegex.test(map.square![y][x+1].image || '')) {
                  coordsCroisements.push({x: x+1, y});
                }
              }
            });
          });
          const resetLightsSub = this.avatarService.resetLights(coordsCroisements).subscribe(() => {
            this.avatarService.getAvatars().subscribe(avatars => {
              this.avatarList = avatars;
            },
            error => {
              console.error(error.message);
            }
            );
            resetLightsSub.unsubscribe();
          },
          console.error);
        },
        error => {
          this.mapResponse = undefined;
          console.log(error.message);
        }
      );
      this.avatarService.resetAvatars().subscribe(() => {}, console.error);
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.obs.unsubscribe();
  }

  /**
   * Subscribe to the client broker.
   * Return the current status of the batch.
   */
  private initProgressWebSocket = () => {
    this.obs = this.progressWebsocketService.getObservable();

    this.obs.subscribe({
      next: this.onNewProgressMsg,
      error: (err: any) => {
        console.log(err);
      }
    });
  };

  /**
   * Apply result of the java server notification to the view.
   */
  private onNewProgressMsg = (receivedMsg: { type: string; message: any; }) => {
    if (receivedMsg.type === 'SUCCESS') {
      if (receivedMsg.message instanceof Object) {
        this.displayAvatar(receivedMsg.message);
      } else {
        this.displayTime(receivedMsg.message);
        const sub = this.avatarService.moveAvatars(this.avatarList || []).subscribe(() => {
          sub.unsubscribe();
        });
      }
    }
  };

  display(x: number, y: number, avatar: any): boolean {
    if (avatar.x === x && avatar.y === y) {
      return true;
    }
    return false;
  }

  display2(x: number, y: number, avatars: Avatar[]): string | undefined {
    if (avatars !== undefined) {
      const found = avatars.find(element => element.y === y && element.x === x);

      if (found !== undefined) {
        return found.image;
      }
    }
    return '../assets/images/vide.png';
  }

  isLight(x: number, y: number, avatars: Avatar[]): boolean {
    return avatars?.some((avatar) => {
      return avatar.x === x && avatar.y === y && /-light.png$/.test(avatar.image || "");
    });
  }


  displayTime(second: number): void {
    const hours = Math.floor(second / 60 / 60);
    const minutes = Math.floor(second / 60) - (hours * 60);
    const seconds = second % 60;
    this.timer = hours + 'h :' + minutes + 'm :' + seconds + 's';
  }

  displayAvatar(listAvatar: any): void {
    this.avatarList = (listAvatar as Avatar[]);
  }


}
