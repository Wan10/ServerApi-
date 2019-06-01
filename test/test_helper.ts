process.env.isTesting = 'true';
import '../src/startDatabase';
import { User } from '../src/models/User';
import { Driver } from '../src/models/Driver';
import { Moto } from '../src/models/Moto';


beforeEach('Remove all data', async() => {
    await User.remove({});
    await Driver.remove({});
    await Moto.remove({});
});