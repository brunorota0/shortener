import { Url } from 'src/models/url.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Url)
export class UrlRepository extends Repository<Url> {}
