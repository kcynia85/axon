import { useAgentPosterState } from "../application/hooks/useAgentFormState";
import { LivePoster } from "./LivePoster";

export const ConnectedLivePoster = () => {
	const data = useAgentPosterState();
	return <LivePoster data={data} />;
};
