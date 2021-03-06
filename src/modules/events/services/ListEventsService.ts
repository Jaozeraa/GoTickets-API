import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import IEventsRepository from '@modules/events/repositories/IEventsRepository';
import ITicketsRepository from '@modules/tickets/repositories/ITicketsRepository';
import { isAfter } from 'date-fns';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

@injectable()
export default class ListEventsService {
  constructor(
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}
  public async execute(): Promise<any> {
    const events = await this.eventsRepository.findAll();

    const unavailableEvents = events.filter(
      event => !isAfter(new Date(event.date), new Date()),
    );

    unavailableEvents.forEach(async event => {
      if (event.promo_image) {
        await this.storageProvider.deleteFile(event.promo_image);
      }

      await this.eventsRepository.deleteByEvent(event);
    });

    const availableEvents = events.filter(
      event =>
        isAfter(new Date(event.date), new Date()) &&
        event.available_tickets > 0,
    );

    return availableEvents;
  }
}
