DROP TRIGGER IF EXISTS trg_sync_business_role ON public.profiles;
CREATE TRIGGER trg_sync_business_role
AFTER UPDATE ON public.profiles
FOR EACH ROW
WHEN (OLD.account_type IS DISTINCT FROM NEW.account_type
   OR OLD.status IS DISTINCT FROM NEW.status
   OR OLD.suspended IS DISTINCT FROM NEW.suspended)
EXECUTE FUNCTION public.trg_sync_business_role_fn();