import * as path from "path";
import * as os from "os";


// GENERAL CONSTANTS
export const BASH_PROFILE_FILE =  path.join(os.homedir(), '.bash_profile');
export const SKIP_FILES = ['node_modules', '.template.json', '.next', 'yarn.lock', 'package-lock.json'];

// ORCHESTRATOR PROJECT FILE
export const ORCHESTRATOR_FILE_NAME = 'terrastrator.yaml';
export const MANDATORY_FIELDS = ['name', 'stateBucket', 'region'];

// PROJECT DEFAULT FIELDS
export const DEFAULT_REGION = 'eu-west-1';
export const DEFAULT_PROJECT_NAME = 'the-dock';
export const DEFAULT_STATE_BUCKET = `state-bucket-${Math.random().toString(36).substring(7)}`;

// TERRAFORM DEFAULT FIELDS
export const TERRAFORM_ACTIONS = ['apply', 'plan', 'destroy'];
